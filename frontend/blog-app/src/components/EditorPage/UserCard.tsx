import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserRoundPen } from "lucide-react"

export function UserCard() {
  return (
    <Card className="w-[70%] max-w-md h-[500px] gap-4 bg-white/10 border-none shadow-xl text-white rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Blog details</CardTitle>
        <CardDescription className="text-gray-300">
          Enter the blog details below:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Blog title"
                required
                className="border-1 border-gray-500 bg-white/10"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <UserRoundPen className='size-4'/>
                <Label htmlFor="Author">Author</Label>
              </div>
              <Input id="Author"
                type="text" 
                required 
                placeholder="By default User"
                className="border-1 border-gray-500 bg-white/10"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="picture">Cover image</Label>
              <div className="h-32 border-1 rounded-xl border-gray-500 border-dashed flex items-center justify-center">
                  <h1 className="text-2xl">Image Upload</h1>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full text-lg h-9" variant='preview'>
          Save
        </Button>
      </CardFooter>
    </Card>
  )
}

export default UserCard;

