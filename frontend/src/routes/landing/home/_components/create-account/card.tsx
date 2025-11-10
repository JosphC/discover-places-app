import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateAccountForm } from "./form";

export const CreateAccountCard = () => {
  return (
    <Card className="shadow-sm rounded-lg">
      <CardHeader>
        <CardTitle>Join Today</CardTitle>
        <CardDescription>
          Create an account to start saving your favorite places, organizing
          locations, and exploring the world your way.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateAccountForm />
      </CardContent>
    </Card>
  );
};
