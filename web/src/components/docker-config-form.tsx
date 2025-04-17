import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Download, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

// Define base images with their tags
const baseImages = [
  { name: "Ubuntu", tags: ["latest", "20.04", "18.04"] },
  { name: "Alpine", tags: ["latest", "3.14", "3.13"] },
  { name: "Node.js", tags: ["latest", "16", "14", "lts"] },
  { name: "Python", tags: ["latest", "3.9", "3.8", "3.7"] },
  { name: "Nginx", tags: ["latest", "1.21", "1.20"] },
  { name: "Redis", tags: ["latest", "6.2", "6.0"] },
  { name: "MongoDB", tags: ["latest", "5.0", "4.4"] },
  { name: "PostgreSQL", tags: ["latest", "14", "13", "12"] },
]

// Form schema
const formSchema = z.object({
  baseImage: z.string().min(1, "Base image is required"),
  imageTag: z.string().min(1, "Image tag is required"),
  containerName: z.string().min(1, "Container name is required"),
  cpuLimit: z.string().optional(),
  memoryLimit: z.string().optional(),
  ports: z.array(
    z.object({
      hostPort: z.string().regex(/^\d+$/, "Must be a valid port number"),
      containerPort: z.string().regex(/^\d+$/, "Must be a valid port number"),
    }),
  ),
  envVars: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),
      value: z.string(),
    }),
  ),
  volumes: z.array(
    z.object({
      hostPath: z.string().min(1, "Host path is required"),
      containerPath: z.string().min(1, "Container path is required"),
    }),
  ),
  workdir: z.string().optional(),
  cmd: z.string().optional(),
})

export default function DockerConfigForm() {
  const [selectedBaseImage, setSelectedBaseImage] = useState("")
  const [generatedDockerfile, setGeneratedDockerfile] = useState("")
  const [generatedCompose, setGeneratedCompose] = useState("")
  const [activeTab, setActiveTab] = useState("form")

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseImage: "",
      imageTag: "",
      containerName: "",
      cpuLimit: "",
      memoryLimit: "",
      ports: [{ hostPort: "", containerPort: "" }],
      envVars: [{ key: "", value: "" }],
      volumes: [{ hostPath: "", containerPath: "" }],
      workdir: "",
      cmd: "",
    },
  })

  // Get available tags for selected base image
  const getAvailableTags = () => {
    const image = baseImages.find((img) => img.name === selectedBaseImage)
    return image ? image.tags : []
  }

  // Add new port mapping
  const addPort = () => {
    const currentPorts = form.getValues("ports")
    form.setValue("ports", [...currentPorts, { hostPort: "", containerPort: "" }])
  }

  // Remove port mapping
  const removePort = (index: number) => {
    const currentPorts = form.getValues("ports")
    if (currentPorts.length > 1) {
      form.setValue(
        "ports",
        currentPorts.filter((_, i) => i !== index),
      )
    }
  }

  // Add new environment variable
  const addEnvVar = () => {
    const currentEnvVars = form.getValues("envVars")
    form.setValue("envVars", [...currentEnvVars, { key: "", value: "" }])
  }

  // Remove environment variable
  const removeEnvVar = (index: number) => {
    const currentEnvVars = form.getValues("envVars")
    if (currentEnvVars.length > 1) {
      form.setValue(
        "envVars",
        currentEnvVars.filter((_, i) => i !== index),
      )
    }
  }

  // Add new volume
  const addVolume = () => {
    const currentVolumes = form.getValues("volumes")
    form.setValue("volumes", [...currentVolumes, { hostPath: "", containerPath: "" }])
  }

  // Remove volume
  const removeVolume = (index: number) => {
    const currentVolumes = form.getValues("volumes")
    if (currentVolumes.length > 1) {
      form.setValue(
        "volumes",
        currentVolumes.filter((_, i) => i !== index),
      )
    }
  }

  // Generate Dockerfile and docker-compose.yml
  const generateFiles = (data: z.infer<typeof formSchema>) => {
    // Generate Dockerfile
    let dockerfile = `FROM ${data.baseImage}:${data.imageTag}\n\n`

    if (data.workdir) {
      dockerfile += `WORKDIR ${data.workdir}\n\n`
    }

    if (data.envVars.length > 0) {
      data.envVars.forEach((env) => {
        if (env.key) {
          dockerfile += `ENV ${env.key}=${env.value}\n`
        }
      })
      dockerfile += "\n"
    }

    if (data.cmd) {
      dockerfile += `CMD ${data.cmd}\n`
    }

    setGeneratedDockerfile(dockerfile)

    // Generate docker-compose.yml
    let compose = `version: '3'\n\nservices:\n  ${data.containerName}:\n    build: .\n`

    if (data.cpuLimit || data.memoryLimit) {
      compose += "    deploy:\n      resources:\n        limits:\n"
      if (data.cpuLimit) {
        compose += `          cpus: '${data.cpuLimit}'\n`
      }
      if (data.memoryLimit) {
        compose += `          memory: ${data.memoryLimit}\n`
      }
    }

    if (data.ports.length > 0 && data.ports[0].hostPort) {
      compose += "    ports:\n"
      data.ports.forEach((port) => {
        if (port.hostPort && port.containerPort) {
          compose += `      - "${port.hostPort}:${port.containerPort}"\n`
        }
      })
    }

    if (data.envVars.length > 0 && data.envVars[0].key) {
      compose += "    environment:\n"
      data.envVars.forEach((env) => {
        if (env.key) {
          compose += `      - ${env.key}=${env.value}\n`
        }
      })
    }

    if (data.volumes.length > 0 && data.volumes[0].hostPath) {
      compose += "    volumes:\n"
      data.volumes.forEach((volume) => {
        if (volume.hostPath && volume.containerPath) {
          compose += `      - ${volume.hostPath}:${volume.containerPath}\n`
        }
      })
    }

    setGeneratedCompose(compose)
    setActiveTab("preview")
  }

  // Download file
  const downloadFile = (content: string, filename: string) => {
    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="form">Configuration Form</TabsTrigger>
        <TabsTrigger value="preview">Generated Files</TabsTrigger>
      </TabsList>

      <TabsContent value="form">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(generateFiles)} className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Base Image Selection */}
                  <FormField
                    control={form.control}
                    name="baseImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Image</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedBaseImage(value)
                            form.setValue("imageTag", "")
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a base image" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {baseImages.map((image) => (
                              <SelectItem key={image.name} value={image.name}>
                                {image.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Tag Selection */}
                  <FormField
                    control={form.control}
                    name="imageTag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Tag</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedBaseImage}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tag" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getAvailableTags().map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Container Name */}
                  <FormField
                    control={form.control}
                    name="containerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Container Name</FormLabel>
                        <FormControl>
                          <Input placeholder="my-container" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Working Directory */}
                  <FormField
                    control={form.control}
                    name="workdir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Working Directory</FormLabel>
                        <FormControl>
                          <Input placeholder="/app" {...field} />
                        </FormControl>
                        <FormDescription>Optional working directory inside the container</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CPU Limit */}
                  <FormField
                    control={form.control}
                    name="cpuLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPU Limit</FormLabel>
                        <FormControl>
                          <Input placeholder="0.5" {...field} />
                        </FormControl>
                        <FormDescription>Optional CPU limit (e.g., 0.5 for half a CPU)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Memory Limit */}
                  <FormField
                    control={form.control}
                    name="memoryLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Memory Limit</FormLabel>
                        <FormControl>
                          <Input placeholder="512M" {...field} />
                        </FormControl>
                        <FormDescription>Optional memory limit (e.g., 512M, 1G)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Command */}
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="cmd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Command</FormLabel>
                          <FormControl>
                            <Input placeholder='["node", "server.js"]' {...field} />
                          </FormControl>
                          <FormDescription>
                            Optional command to run (JSON array format or shell command)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Port Mappings */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-medium">Port Mappings</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addPort}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Port
                  </Button>
                </div>
                <div className="space-y-4">
                  {form.watch("ports").map((_, index) => (
                    <div key={index} className="flex items-end gap-4">
                      <FormField
                        control={form.control}
                        name={`ports.${index}.hostPort`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Host Port</FormLabel>
                            <FormControl>
                              <Input placeholder="8080" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`ports.${index}.containerPort`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Container Port</FormLabel>
                            <FormControl>
                              <Input placeholder="80" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePort(index)}
                        disabled={form.watch("ports").length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Environment Variables */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-medium">Environment Variables</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addEnvVar}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variable
                  </Button>
                </div>
                <div className="space-y-4">
                  {form.watch("envVars").map((_, index) => (
                    <div key={index} className="flex items-end gap-4">
                      <FormField
                        control={form.control}
                        name={`envVars.${index}.key`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Key</FormLabel>
                            <FormControl>
                              <Input placeholder="NODE_ENV" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`envVars.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                              <Input placeholder="production" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEnvVar(index)}
                        disabled={form.watch("envVars").length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Volumes */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-medium">Volume Mounts</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addVolume}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Volume
                  </Button>
                </div>
                <div className="space-y-4">
                  {form.watch("volumes").map((_, index) => (
                    <div key={index} className="flex items-end gap-4">
                      <FormField
                        control={form.control}
                        name={`volumes.${index}.hostPath`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Host Path</FormLabel>
                            <FormControl>
                              <Input placeholder="./data" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`volumes.${index}.containerPath`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Container Path</FormLabel>
                            <FormControl>
                              <Input placeholder="/data" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVolume(index)}
                        disabled={form.watch("volumes").length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full">
              Generate Docker Files
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="preview">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">Dockerfile</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadFile(generatedDockerfile, "Dockerfile")}
                disabled={!generatedDockerfile}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <Card className="h-[500px]">
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] w-full rounded-md">
                  <pre className="p-4 text-sm">{generatedDockerfile || "No Dockerfile generated yet."}</pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">docker-compose.yml</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadFile(generatedCompose, "docker-compose.yml")}
                disabled={!generatedCompose}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <Card className="h-[500px]">
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] w-full rounded-md">
                  <pre className="p-4 text-sm">{generatedCompose || "No docker-compose.yml generated yet."}</pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => setActiveTab("form")}>
            Back to Form
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
