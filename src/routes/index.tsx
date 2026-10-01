import { createFileRoute } from "@tanstack/react-router";
import ExploreApp from "@/components/ExploreApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ExploreApp />;
}
