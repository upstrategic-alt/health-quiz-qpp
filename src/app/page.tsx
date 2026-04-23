import Quiz from "@/components/Quiz";

export const metadata = {
  title: "Personalized Health Protocol Quiz",
  description: "Discover your optimal protocol management style.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Quiz />
    </main>
  );
}
