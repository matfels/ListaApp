import { useState, useEffect, use } from "react"
// Importando os componentes View e Text do react-native
import { View, Image, TouchableOpacity, Text, FlatList, Alert } from "react-native"
import { styles } from "./styles"
import { Button } from "@/components/Button/index"
import { Input } from "@/components/Input/index"
import { Filter } from "@/components/Filter/index"
import { FilterStatus } from "@/types/FilterStatus"
import { Item } from "@/components/Item"
import { itemsStorage, ItemsStorage } from "@/storage/itemsStorage"

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE]


// Exportando por padrão uma função vazia chamada App

// --------------------------------- Regras para criar um componente -------------------------------- //
// Componente tem que começar com letra maiúscula
// O componente pode retornar um unico elemento pai, que pode ter varios elementos filhos dentro dele.
export function Home() {
  //                      ESTADOOSSS
  const [filter, setFilter] = useState(FilterStatus.PENDING)
  const [description, setDescription] = useState("")
  const [items, setItems] = useState<ItemsStorage[]>([])


  async function handleAdd() {
    if (!description.trim()) {
      console.log("Chamando a função handleAdd, caixa de texto valia")
      return Alert.alert("Adicionar", "Informe a descrição para adicionar um item.")
    }
    const newItem = {
      description,
      id: Math.random().toString(36).substring(2),
      status: FilterStatus.PENDING,

    }
    await itemsStorage.add(newItem)
    await itemsByStatus()

    Alert.alert("Adicionado", `Adicionado ${description}`)
    setDescription("") //Apagamos o texto da caixa de texto.
    setFilter(FilterStatus.PENDING)
  }

  async function itemsByStatus() {
    try {
      const response = await itemsStorage.getByStatus(filter)
      setItems(response)
    } catch (error) {
      console.log(error)
      Alert.alert("Erro", "Não foi possível filtar os itens.")
    }
  }

  async function handleRemove(id: String) {
    try {
      await itemsStorage.remove(id)
      await itemsByStatus()

    } catch (error) {
      console.log(error)
      Alert.alert("Remover", "Não foi possível remover.")
    }
  }

  function handleClear() {
    Alert.alert("Limpar", "Deseja remover todos os items?",[
      { text: "Não", style: "cancel"},
      { text: "Sim", onPress:() => onClear()},
    ])
  }

  async function onClear(){
    try{
      await itemsStorage.clear()
      setItems([])
    } catch(error){
      console.log(error)
      Alert.alert("Limpar", "Erro ao limpar a lista.")
    }
  }

  async function handleToggleItemStatus(id: string){
    try{
      await itemsStorage.toggleStatus(id)
      await itemsByStatus()
    } catch(error){
      console.log(error)
      Alert.alert("Erro", "Não foi possível atualizar o status.")
    }
  }



  useEffect(() => {
    itemsByStatus()
  }, [filter])
  // Chamar os dados do BD
  //useEffect(() => {
  // modo não convencional de recuperar dados. não conseguimos utilziar o asinc e await.
  // itemsStorage.get().then(response => console.log(response)) //.then() Só executa quando a promess do "get" retornar os dados do BD

  // }, [])
  // Toda função precisa retornar algo, o conteudo retornado aqui será exibido na tela.
  // View foi importado lá em cima, junto com o Text. "Essa View é o elemento pai" os elementos tem que estar dentro dela.
  return (
    <View style={styles.container}>
      <Image source={require("@/assets/logo.png")} style={styles.logo} />
      <View style={styles.form}>
        <Input
          placeholder="O que você precisa comprar?"
          onChangeText={setDescription}
          value={description} // estamos utilizando para apagar o texto da caixa de texto apos inserir os dados
        />
        <Button title="Adicionar" onPress={handleAdd} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          {FILTER_STATUS.map((status) => (
            <Filter
              key={status}
              status={status}
              isActive={status === filter}
              onPress={() => setFilter(status)}
            />
          ))}
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Item
              data={item}
              onStatus={() => handleToggleItemStatus(item.id)  }
              onRemove={() => handleRemove(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => <Text style={styles.empty}>Nenhum item aqui.</Text>}
        />

      </View>
    </View>

  )

}


