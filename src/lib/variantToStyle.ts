export interface VariantToStyle {
  path: string;
}

export const variantToStyle: Record<
  string,
  Record<string, VariantToStyle>
> = {
  dropin: {
    v4: {
      path: "packages/lib/src/components/Dropin/components/DropinComponent.scss",
    },
    v5: {
      path: "packages/lib/src/components/Dropin/components/DropinComponent.scss",
    },
    v6: {
      path: "packages/lib/src/components/Dropin/components/DropinComponent.scss",
    },
  },
  card: {
    v4: {
      path: "packages/lib/src/components/Card/components/CardInput/CardInput.scss",
    },
    v5: {
      path: "packages/lib/src/components/Card/components/CardInput/CardInput.scss",
    },
    v6: {
      path: "packages/lib/src/components/Card/components/CardInput/CardInput.scss",
    },
  },
  scheme: {
    v4: {
      path: "packages/lib/src/components/Card/components/CardInput/CardInput.scss",
    },
    v5: {
      path: "packages/lib/src/components/Card/components/CardInput/CardInput.scss",
    },
    v6: {
      path: "packages/lib/src/components/Card/components/CardInput/CardInput.scss",
    },
  },
  paypal: {
    v4: {
      path: "packages/lib/src/components/PayPal/Paypal.scss",
    },
    v5: {
      path: "packages/lib/src/components/PayPal/Paypal.scss",
    },
    v6: {
      path: "packages/lib/src/components/PayPal/Paypal.scss",
    },
  },
  klarna: {
    v5: {
      path: "packages/lib/src/components/Klarna/components/KlarnaWidget/KlarnaWidget.scss",
    },
    v6: {
      path: "packages/lib/src/components/Klarna/components/KlarnaWidget/KlarnaWidget.scss",
    },
  },
};
