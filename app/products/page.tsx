import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("./components/ProductSection"),
  {
    ssr: false,
  }
);

export default function ProductsPage() {
  return (
    <>
      <DynamicComponentWithNoSSR />
    </>
  );
}
