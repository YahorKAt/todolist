import { CreateItemForm } from "@/common/components"
import { useAddTodolistMutation } from "@/features/todolists/api/todolistsApi"
import Container from "@mui/material/Container"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists.tsx"

export const Main = () => {
    const [createTodolist] = useAddTodolistMutation()

    const createTodolistHandler = (title: string) => createTodolist(title)

    return (
        <Container sx={{ display: "flex", flexDirection: "column", gap: "50px" }} className="app">
            <CreateItemForm onCreateItem={createTodolistHandler} />
            <Todolists />
        </Container>
    )
}
