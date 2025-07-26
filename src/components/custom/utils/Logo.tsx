import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center font-bold bg-secondary rounded-lg px-2 py-1">
      <h6 className="text-sm md:text-md font-bold text-primary px-[0.1rem]">Checkout</h6>
      <span className="text-sm md:text-md text-adyen font-bold">Lab</span>
    </Link>
  );
};