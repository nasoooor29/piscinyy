import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { languages } from "@/db";
import Link from "next/link";

export default function App() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
      {Object.entries(languages).map(([k, v]) => (
        <Link key={k} href={`/${k}`}>
          <Card className="cursor-pointer transition hover:shadow-lg">
            <CardContent>
              <CardTitle>{v.name}</CardTitle>
              <p>{v.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
