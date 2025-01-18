import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("./components/Auth"), {
  ssr: false,
});

export default function AuthPage() {
  return (
    <>
      <DynamicComponentWithNoSSR />
    </>
  );
}
