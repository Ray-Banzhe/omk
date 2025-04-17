import DockerConfigForm from "@/components/docker-config-form"

export default function Docker() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Docker Container Configuration</h1>
          <p className="text-muted-foreground text-lg">
            Create and configure Docker containers with an easy-to-use interface
          </p>
        </div>
        <DockerConfigForm />
      </div>
    </main>
  )
}
