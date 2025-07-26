"use client";

/*
List of configurations we want to be able to toggle
Checkout configurations:
1. type switch
label: Local Payment Methods
default value: allowPaymentMethods: ["scheme"] 
toggled ON value: delete allowPaymentMethods: ["scheme"]
updateCheckoutConfiguration

2. type switch
label: show amount on pay button
defaultValue: delete amount if present
toggled ON value: amount: { currency: "USD", value: 1000 }
updateCheckoutConfiguration

3. type dropdown 
label: locale
defaultValue: {locale: "en-US"}
values: ["en-US","es-ES"]
updateCheckoutConfiguration

4. type switch
label: open first payment method
defaultValue: {openFirstPaymentMethod: false }
toggled ON value: {openFirstPaymentMethod: true }
updateTxVariantConfiguration

5. type switch
label: show radio button
defaultValue: { showRadioButton: false }
toggled ON value: { showRadioButton: true }
updateTxVariantConfiguration

6. type switch
label: instant payments

7. 
label: show stored payment methods

8. 
label: add billing address

9.
label: Include card holder name

10.
label: Show only saved Payment Methods

11.
label: hide cvc
*/


import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { formulaActions } from "@/store/reducers";
import {
    clearUrlParams, refineFormula,
  stringifyObject,
    unstringifyObject
} from "@/utils/utils";
import {
  memo,
  useCallback,
  useEffect,
    useState
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { OpenSdkList } from "@/components/custom/sandbox/editors/openSdk/OpenSdkList";

const { updateReset, updateIsRedirect, updateRun } = formulaActions;

interface FeatureSwitchProps {
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    description?: string;
}

const FeatureSwitch = ({ label, checked, onCheckedChange, description }: FeatureSwitchProps) => {
    const [localChecked, setLocalChecked] = useState(!!checked);

    useEffect(() => {
        setLocalChecked(!!checked);
    }, [checked]);

    const handleChange = (newState: boolean) => {
        setLocalChecked(newState);
        onCheckedChange(newState);
    };

    return (
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <Label htmlFor={`feature-${label}`} className="text-sm font-medium">
                    {label}
                </Label>
                {description && (
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            <Switch
                id={`feature-${label}`}
                checked={localChecked}
                onCheckedChange={handleChange}
                className="data-[state=checked]:bg-adyen"
            />
        </div>
    );
};

interface FeatureDropdownProps {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
    description?: string;
}

const FeatureDropdown = ({ label, value, options, onChange, description }: FeatureDropdownProps) => {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
                <Label htmlFor={`feature-${label}`} className="text-sm font-medium">
                    {label}
                </Label>
                {description && (
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

interface Feature {
    id: string;
    label: string;
    description: string;
    type: 'switch' | 'dropdown';
    configObject: Record<string, any>;
    defaultObject?: Record<string, any>;
    options?: { label: string; value: string }[];
    isCheckoutOnly?: boolean;
    isVariantOnly?: boolean;
}

const checkoutFeatures: Feature[] = [{
    id: "locale",
    label: "Locale",
    description: "Set the checkout language and region",
    type: 'dropdown',
    configObject: { locale: "en-US" }, // Will be overridden by selected value
    options: [
        { label: "English (US)", value: "en-US" },
        { label: "Spanish (Spain)", value: "es-ES" }
    ]
},
{
    id: "local-payment-methods",
    label: "Local Payment Methods",
    description: "Enable local payment methods",
    type: 'switch',
    configObject: { allowPaymentMethods: ["googlepay","paypal","scheme"] },
    defaultObject: { allowPaymentMethods: ["scheme"] }
},
{
    id: "show-amount-button",
    label: "Show amount on pay button",
    description: "Display the payment amount on the button",
    type: 'switch',
    configObject: { amount: { currency: "USD", value: 21492 } },
    defaultObject: {} // Remove amount if present
}
];

const variantFeatures: Feature[] = [
    {
        id: "open-first-payment",
        label: "Open first payment method",
        description: "Automatically open the first payment method when the checkout loads",
        type: 'switch',
        configObject: { openFirstPaymentMethod: false },
        defaultObject: { openFirstPaymentMethod: false }
    },
    {
        id: "show-radio-button",
        label: "Show radio buttons",
        description: "Display radio buttons for payment method selection",
        type: 'switch',
        configObject: { showRadioButton: true },
        defaultObject: { showRadioButton: false }
    }
];

interface FeatureCategoryProps {
    title: string;
    features: Feature[];
    config: any;
    onToggle: (feature: Feature, enabled: boolean) => void;
    onDropdownChange: (feature: Feature, value: string) => void;
}

const FeatureCategory = ({ title, features, config, onToggle, onDropdownChange }: FeatureCategoryProps) => {
    const isFeatureEnabled = useCallback((feature: Feature, config: any) => {
        if (!config) return false;

        // For dropdown type, it's always "enabled"
        if (feature.type === 'dropdown') return true;

        // Special case for open first payment method
        if (feature.id === 'open-first-payment') {
            return true;
        }

        // General case
        return Object.entries(feature.configObject).every(([key, expectedValue]) => {
            const configValue = config[key];

            if (configValue === undefined) return false;

            if (typeof expectedValue !== 'object' || expectedValue === null) {
                return configValue === expectedValue;
            } else {
                try {
                    return JSON.stringify(configValue) === JSON.stringify(expectedValue);
                } catch (e) {
                    return false;
                }
            }
        });
    }, []);

    const getDropdownValue = useCallback((feature: Feature, config: any) => {
        if (!config || !feature.options) return feature.options?.[0]?.value || '';
        return config[Object.keys(feature.configObject)[0]] || feature.options[0].value;
    }, []);

    return (
        <div className="space-y-4">
            <div className="space-y-6">
                {features.map((feature) => (
                    feature.type === 'dropdown' ? (
                        <FeatureDropdown
                            key={feature.id}
                            label={feature.label}
                            value={getDropdownValue(feature, config)}
                            options={feature.options || []}
                            onChange={(value) => onDropdownChange(feature, value)}
                            description={feature.description}
                        />
                    ) : (
                        <FeatureSwitch
                            key={feature.id}
                            label={feature.label}
                            checked={isFeatureEnabled(feature, config)}
                            onCheckedChange={(checked) => onToggle(feature, checked)}
                            description={feature.description}
                        />
                    )
                ))}
            </div>
        </div>
    );
};

const applyFeatureToConfig = (
    feature: Feature,
    enabled: boolean,
    currentConfig: any
): any => {
    const newConfig = { ...currentConfig };

    // Special case for show amount on pay button
    if (feature.id === 'show-amount-button') {
        if (enabled) {
            Object.entries(feature.configObject).forEach(([key, value]) => {
                newConfig[key] = value;
            });
        } else if (feature.configObject) {
            delete newConfig.amount;
        }
        return newConfig;
    }

    // Special case for open first payment method
    if (feature.id === 'open-first-payment') {
        newConfig.openFirstPaymentMethod = enabled;
        return newConfig;
    }

    if (enabled) {
        // Apply the entire config object when enabled
        Object.entries(feature.configObject).forEach(([key, value]) => {
            newConfig[key] = value;
        });
    } else if (feature.defaultObject) {
        // Apply the default object when disabled if provided
        Object.entries(feature.defaultObject).forEach(([key, value]) => {
            newConfig[key] = value;
        });
    } else {
        // Remove keys from config if no default is provided
        Object.keys(feature.configObject).forEach(key => {
            delete newConfig[key];
        });
    }

    return newConfig;
};

const applyDropdownValueToConfig = (
    feature: Feature,
    value: string,
    currentConfig: any
): any => {
    const newConfig = { ...currentConfig };
    const configKey = Object.keys(feature.configObject)[0];

    if (configKey) {
        newConfig[configKey] = value;
    }

    return newConfig;
};

interface FeaturesProps {
    checkoutConfiguration: any;
    updateCheckoutConfiguration: (config: any) => void;
    txVariantConfiguration: any;
    updateTxVariantConfiguration: (config: any) => void;
    variant: string;
    theme: string;
    view: string;
    integration: string;
    description: string;
}

const Features = ({
    checkoutConfiguration,
    updateCheckoutConfiguration,
    txVariantConfiguration,
    updateTxVariantConfiguration,
    variant,
    theme,
    view,
    integration,
    description,
}: FeaturesProps) => {
    const dispatch: any = useDispatch();
  const [localError, setLocalError] = useState<any>(null);
    // Add a forceUpdate counter to trigger re-renders
    const [updateCounter, setUpdateCounter] = useState(0);

    // Force component to re-render
    const forceUpdate = useCallback(() => {
        setUpdateCounter(prev => prev + 1);
  }, []);

    // Force reload of configurations after each toggle
    const [manualCheckoutConfig, setManualCheckoutConfig] = useState<any>(checkoutConfiguration);
    const [manualVariantConfig, setManualVariantConfig] = useState<any>(txVariantConfiguration);
    const storeFormula = useSelector((state: { formula: any }) => state.formula);
    const storeToLocalStorage = (data: any) => {
        sessionStorage.setItem("formula", JSON.stringify(data));
    };
    // Update manual configs when props change
  useEffect(() => {
        setManualCheckoutConfig(checkoutConfiguration);
    }, [checkoutConfiguration]);

  useEffect(() => {
        setManualVariantConfig(txVariantConfiguration);
    }, [txVariantConfiguration]);

    // Parse configurations
    const parsedCheckoutConfig = typeof manualCheckoutConfig === 'string'
        ? unstringifyObject(manualCheckoutConfig)
        : manualCheckoutConfig || {};

    const parsedVariantConfig = typeof manualVariantConfig === 'string'
        ? unstringifyObject(manualVariantConfig)
        : manualVariantConfig || {};

    // Feature toggle handlers
    const handleCheckoutFeatureToggle = useCallback((feature: Feature, enabled: boolean) => {
        // Create a new config object from the parsed checkout config
        const newConfig = applyFeatureToConfig(feature, enabled, parsedCheckoutConfig);
        const stringified = stringifyObject(newConfig);

        // Update the Redux store with the stringified configuration
        dispatch(updateCheckoutConfiguration(stringified));
        storeToLocalStorage(refineFormula(storeFormula));
        clearUrlParams([
            "redirectResult",
            "paRes",
            "MD",
            "sessionId",
            "sessionData",
        ]);
        dispatch(updateIsRedirect(false));
        dispatch(updateRun());
        // Update local state to force re-render
        setManualCheckoutConfig(stringified);
        forceUpdate();

    }, [parsedCheckoutConfig, updateCheckoutConfiguration, dispatch, forceUpdate, updateReset]);

    const handleVariantFeatureToggle = useCallback((feature: Feature, enabled: boolean) => {
        // Create a new config object from the parsed variant config
        const newConfig = applyFeatureToConfig(feature, enabled, parsedVariantConfig);

        // Stringify the new config
        const stringified = stringifyObject(newConfig);

        // Update the Redux store with the stringified configuration
        dispatch(updateTxVariantConfiguration(stringified));
        storeToLocalStorage(refineFormula(storeFormula));
        clearUrlParams([
            "redirectResult",
            "paRes",
            "MD",
            "sessionId",
            "sessionData",
        ]);
        dispatch(updateIsRedirect(false));
        dispatch(updateRun());
        // Update local state to force re-render
        setManualVariantConfig(stringified);
        forceUpdate();

    }, [parsedVariantConfig, updateTxVariantConfiguration, dispatch, forceUpdate, updateReset]);

    // Dropdown change handlers
    const handleCheckoutDropdownChange = useCallback((feature: Feature, value: string) => {
        const newConfig = applyDropdownValueToConfig(feature, value, parsedCheckoutConfig);
        const stringified = stringifyObject(newConfig);

        // Update the Redux store with the stringified configuration
        dispatch(updateCheckoutConfiguration(stringified));
        storeToLocalStorage(refineFormula(storeFormula));
        clearUrlParams([
            "redirectResult",
            "paRes",
            "MD",
            "sessionId",
            "sessionData",
        ]);
        dispatch(updateIsRedirect(false));
        dispatch(updateRun());
        // Update local state to force re-render
        setManualCheckoutConfig(stringified);
        forceUpdate();

    }, [parsedCheckoutConfig, updateCheckoutConfiguration, dispatch, forceUpdate, updateReset]);

    const handleVariantDropdownChange = useCallback((feature: Feature, value: string) => {
        const newConfig = applyDropdownValueToConfig(feature, value, parsedVariantConfig);
        const stringified = stringifyObject(newConfig);

        dispatch(updateTxVariantConfiguration(stringified));
        storeToLocalStorage(refineFormula(storeFormula));
        clearUrlParams([
            "redirectResult",
            "paRes",
            "MD",
            "sessionId",
            "sessionData",
        ]);
        dispatch(updateIsRedirect(false));
        dispatch(updateRun());
        // Update local state to force re-render
        setManualVariantConfig(stringified);
        forceUpdate();
    }, [parsedVariantConfig, updateTxVariantConfiguration, dispatch, forceUpdate, updateReset]);

  return (
        <div className="inline-block !overflow-y-scroll pt-1 w-full h-full">
            <div
                className="shadow-hover sm:flex flex-col transition-all duration-300 ease-in-out bg-card h-full w-full border-[1px] rounded-lg p-[1px] border-border"
            >
                <div className="p-6">
                    <h3 className="pb-3 text-[1rem] text-adyen font-bold">{"Checkout Features"}</h3>
                    <div>                    {/* Checkout Features Section */}
                        <FeatureCategory
                            title="Checkout Features"
                            features={checkoutFeatures}
                            config={parsedCheckoutConfig}
                            onToggle={handleCheckoutFeatureToggle}
                            onDropdownChange={handleCheckoutDropdownChange}
                        />

                        {/* Variant Features Section */}
                        <div className="pt-6">
                            <FeatureCategory
                                title="Variant Features"
                                features={variantFeatures}
                                config={parsedVariantConfig}
                                onToggle={handleVariantFeatureToggle}
                                onDropdownChange={handleVariantDropdownChange}
                        /></div>
                    </div>
                </div>
          </div>
        </div>
  );
};

const MemoizedOpenSdkList = memo(OpenSdkList);

export default memo(Features);
