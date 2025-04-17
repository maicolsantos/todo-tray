import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { ThemeProvider } from "./components/theme-provider"
import TodoList from "./components/todo-list"
import Notes from "./components/notes"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Todo & Notes App</h1>

        <Tabs defaultValue="todo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="todo">Todo List</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="todo">
            <TodoList />
          </TabsContent>

          <TabsContent value="notes">
            <Notes />
          </TabsContent>
        </Tabs>
      </div>
    </ThemeProvider>
  )
}

export default App
