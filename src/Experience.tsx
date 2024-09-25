import { PropsWithChildren } from "react"

type ExperienceProps = {
    description: string,
}

export default function Experience(props: Readonly<PropsWithChildren<ExperienceProps>>) {
    const { children, description } = props;
    return (
        <li>
            {description}
            {children}
        </li>
    )
}