type HeaderProps = {
    student: string,
    degree: string,
    points: number,
}

export function Header(props: HeaderProps) {

    return (
        <header>
            <h2>{props.student}</h2>
            <p>{props.degree} {props.points} studiepoeng</p>
        </header>
    )
}
