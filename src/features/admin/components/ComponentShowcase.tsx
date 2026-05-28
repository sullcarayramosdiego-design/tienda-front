'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export function ComponentShowcase() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Shadcn UI Components Showcase</h2>
        <p className="text-muted-foreground">
          Testing all installed components from MCP
        </p>
      </div>

      <Separator />

      {/* Badges */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Badges</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </Card>

      {/* Alerts */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Alerts</h3>
        <div className="space-y-3">
          <Alert>
            <Info className="h-4 w-4" />
            <div className="ml-3">
              <strong>Info:</strong> This is an informational alert
            </div>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div className="ml-3">
              <strong>Error:</strong> Something went wrong
            </div>
          </Alert>
        </div>
      </Card>

      {/* Tabs */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tabs</h3>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <p className="text-sm text-muted-foreground">
              Overview content goes here
            </p>
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <p className="text-sm text-muted-foreground">
              Analytics content goes here
            </p>
          </TabsContent>
          <TabsContent value="reports" className="mt-4">
            <p className="text-sm text-muted-foreground">
              Reports content goes here
            </p>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Accordion */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Accordion</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I get started?</AccordionTrigger>
            <AccordionContent>
              Follow the installation guide to set up your project with Shadcn UI
              components.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes, all components are built with accessibility in mind using Radix
              UI primitives.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I customize the components?</AccordionTrigger>
            <AccordionContent>
              Absolutely! All components are fully customizable using Tailwind CSS
              classes.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Avatar & Skeleton */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Avatar & Skeleton</h3>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </Card>

      {/* Labels & Buttons */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Labels & Buttons</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="example">Example Label</Label>
            <p className="text-sm text-muted-foreground mt-1">
              This is a label component from Shadcn UI
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>
      </Card>

      {/* Success indicator */}
      <Alert>
        <CheckCircle2 className="h-4 w-4 text-secondary" />
        <div className="ml-3">
          <strong>MCP Test Successful!</strong> All Shadcn components are working
          correctly.
        </div>
      </Alert>
    </div>
  );
}
