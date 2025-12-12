import { TouchableOpacity, TouchableOpacityProps, Text, TextProps } from "react-native";
import { styles } from "./styles";

// Declarando typagem no TypeScript
type Props = TouchableOpacityProps & {
    title: string
}

export function Button({ title, ...rest }: Props) {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8} {...rest}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>

    )
}

//obsevação, na tag <texto> estamos utlizando props dentro de chaves "{}" para conseguir pegar a tipo titulo. 