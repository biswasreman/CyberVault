import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LockIcon, UnlockIcon, CopyIcon, ShieldIcon, Trash2Icon } from "lucide-react";
import { encryptText, decryptText } from "@/lib/encryption";

const encryptSchema = z.object({
  text: z.string().min(1, "Text is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const decryptSchema = z.object({
  encryptedText: z.string().min(1, "Encrypted text is required"),
  password: z.string().min(1, "Password is required"),
});

export default function Home() {
  const { toast } = useToast();
  const [result, setResult] = useState("");
  
  const encryptForm = useForm<z.infer<typeof encryptSchema>>({
    resolver: zodResolver(encryptSchema),
    defaultValues: {
      text: "",
      password: "",
    },
  });

  const decryptForm = useForm<z.infer<typeof decryptSchema>>({
    resolver: zodResolver(decryptSchema),
    defaultValues: {
      encryptedText: "",
      password: "",
    },
  });

  const onEncrypt = (values: z.infer<typeof encryptSchema>) => {
    try {
      const encrypted = encryptText(values.text, values.password);
      setResult(encrypted);
      toast({
        title: "Text encrypted successfully!",
        description: "You can now copy and share the encrypted text.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Encryption failed",
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const onDecrypt = (values: z.infer<typeof decryptSchema>) => {
    try {
      const decrypted = decryptText(values.encryptedText, values.password);
      setResult(decrypted);
      toast({
        title: "Text decrypted successfully!",
        description: "Your message has been recovered.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Decryption failed",
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied to clipboard!",
      description: "The text has been copied to your clipboard.",
    });
  };

  const clearAll = () => {
    encryptForm.reset();
    decryptForm.reset();
    setResult("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-950/30">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 mb-2">
            RemanCrypt
          </h1>
          <p className="text-muted-foreground">
            Secure text encryption for the digital age
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/90 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5 text-blue-400" />
              <span>Text Encryption Tool</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="encrypt" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="encrypt">
                  <LockIcon className="h-4 w-4 mr-2" />
                  Encrypt
                </TabsTrigger>
                <TabsTrigger value="decrypt">
                  <UnlockIcon className="h-4 w-4 mr-2" />
                  Decrypt
                </TabsTrigger>
              </TabsList>

              <TabsContent value="encrypt">
                <Form {...encryptForm}>
                  <form onSubmit={encryptForm.handleSubmit(onEncrypt)} className="space-y-4">
                    <FormField
                      control={encryptForm.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Text to Encrypt</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your message here..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={encryptForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Encryption Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter a secure password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      <LockIcon className="h-4 w-4 mr-2" />
                      Encrypt Text
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="decrypt">
                <Form {...decryptForm}>
                  <form onSubmit={decryptForm.handleSubmit(onDecrypt)} className="space-y-4">
                    <FormField
                      control={decryptForm.control}
                      name="encryptedText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Encrypted Text</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste the encrypted text here..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={decryptForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Decryption Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter the password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      <UnlockIcon className="h-4 w-4 mr-2" />
                      Decrypt Text
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            {result && (
              <div className="mt-8 space-y-4">
                <div className="p-4 bg-blue-950/20 rounded-lg border border-blue-500/20">
                  <h3 className="text-sm font-medium text-blue-400 mb-2">Result</h3>
                  <p className="text-sm break-all">{result}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={copyToClipboard} className="flex-1">
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            RemanCrypt™ - Licensed by Reman Biswas
          </p>
          <p className="mt-1">
            Contact: <a href="mailto:support@reman.online" className="text-blue-400 hover:text-blue-300">
              support@reman.online
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
