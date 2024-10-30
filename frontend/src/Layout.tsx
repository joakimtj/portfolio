import type { PropsWithChildren } from "react";

type LayoutProps = PropsWithChildren;

export default function Layout(props: LayoutProps) {
    const { children } = props;

    return (
        <>
            {children}
        </>
    );
}