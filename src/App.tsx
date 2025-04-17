import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { ThemeProvider } from "./components/theme-provider"
import TodoList from "./components/todo-list"
import Notes from "./components/notes"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="w-full">
        <Tabs defaultValue="todo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="todo">Todo List</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <div className="px-4">
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
