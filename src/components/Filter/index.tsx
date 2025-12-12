import { styles } from "./styles"
import { TouchableOpacity, TouchableOpacityProps, Text, } from "react-native"
import { FilterStatus } from "@/types/FilterStatus" 
import {StatusIcon} from "../StatusIcon"



type Props = TouchableOpacityProps & {
    status: FilterStatus,
    isActive: boolean,
}

export function Filter({status, isActive, ...rest}: Props){
    return(

        <TouchableOpacity 
        style={[styles.container, { opacity: isActive ? 1 : 0.5}]}
        activeOpacity={0.8}  
        {...rest}>
            <StatusIcon status={status}/>
            <Text style={styles.title}>
                {status === FilterStatus.DONE? "Comprados": "Pendentes"} {/* Condição ternária, se status for igual a 'DONE = Compresdo' else 'Pendentes' */}
            </Text>
        </TouchableOpacity>
        )
}