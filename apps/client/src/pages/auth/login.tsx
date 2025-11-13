// import { Button } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full justify-center items-center px-4">
      <Card className="max-w-sm w-[500px] border-gray-400 ">
        <CardHeader>
          <CardTitle className="text-2xl">Login to your account</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input placeholder="Email address" className="border-gray-400 focus-visible:border-2"/>
            </div>
            <Button className="bg-black text-white">Submit</Button>
          </form>
        </CardContent>
        {/* <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  );
}
