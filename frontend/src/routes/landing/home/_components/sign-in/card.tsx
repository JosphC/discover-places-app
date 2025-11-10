import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "./form";

export const SignInCard = () => {
  return (
    <Card className="shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Access your locations effortlessly. Enter your credentials to manage,
          explore, and organize your favorite places with ease.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  );
};
