import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { ThemeProvider } from "./components/theme-provider"
import TodoList from "./components/todo-list"
import Notes from "./components/notes"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="w-full">
        <Tabs defaultValue="todo" className="w-full relative h-screen">
          <TabsList className="grid w-full grid-cols-2 sticky top-0">
            <TabsTrigger value="todo">Todo List</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <div className="h-[calc(100vh-52px)]">
            <TabsContent value="todo">
              <TodoList />
            </TabsContent>

            <TabsContent value="notes">
              <Notes />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </ThemeProvider>
  )
}

export default App
