'use client';

import { useState } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, Input, Badge, Avatar } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';

interface UIShowcasePageProps {
  params: {
    locale: Locale;
  };
}

export const UIShowcasePage = ({ params }: UIShowcasePageProps) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-primary-600">AqshaTracker UI Components</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
            <div key={shade} className="flex flex-col items-center">
              <div 
                className={`w-full h-20 rounded-md mb-2 bg-primary-${shade} flex items-end justify-center p-2`}
                style={{ backgroundColor: `var(--primary-${shade})` }}
              >
                {shade >= 500 && <span className="text-white font-medium">{shade}</span>}
                {shade < 500 && <span className="text-primary-900 font-medium">{shade}</span>}
              </div>
              <span className="text-sm text-gray-600">Primary {shade}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-medium">Button Variants</h3>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </CardBody>
          <CardFooter>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
          </CardFooter>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardBody>
              <h3 className="text-xl font-medium mb-2">Simple Card</h3>
              <p>A basic card with just body content.</p>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-xl font-medium">Card with Header</h3>
            </CardHeader>
            <CardBody>
              <p>This card has a header section.</p>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-xl font-medium">Complete Card</h3>
            </CardHeader>
            <CardBody>
              <p>This card has header, body, and footer sections.</p>
            </CardBody>
            <CardFooter>
              <Button variant="primary" size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Form Elements</h2>
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input 
                  label="Standard Input" 
                  placeholder="Enter text here" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              
              <div>
                <Input 
                  label="With Helper Text" 
                  placeholder="Enter text here" 
                  helperText="This is some helpful text"
                />
              </div>
              
              <div>
                <Input 
                  label="With Error" 
                  placeholder="Enter text here" 
                  error="This field is required"
                />
              </div>
              
              <div>
                <Input 
                  label="Disabled Input" 
                  placeholder="This input is disabled" 
                  disabled
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Badges</h2>
        <Card>
          <CardBody>
            <div className="flex flex-wrap gap-4">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex flex-wrap gap-4">
              <Badge variant="primary" rounded>Primary</Badge>
              <Badge variant="secondary" rounded>Secondary</Badge>
              <Badge variant="success" rounded>Success</Badge>
              <Badge variant="warning" rounded>Warning</Badge>
              <Badge variant="error" rounded>Error</Badge>
              <Badge variant="info" rounded>Info</Badge>
            </div>
          </CardFooter>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Avatars</h2>
        <Card>
          <CardBody>
            <div className="flex flex-wrap gap-8 items-end">
              <Avatar size="xs" name="John Doe" />
              <Avatar size="sm" name="John Doe" />
              <Avatar size="md" name="John Doe" />
              <Avatar size="lg" name="John Doe" />
              <Avatar size="xl" name="John Doe" />
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex flex-wrap gap-8">
              <Avatar name="John Doe" status="online" />
              <Avatar name="Jane Smith" status="offline" />
              <Avatar name="Bob Johnson" status="busy" />
              <Avatar name="Alice Brown" status="away" />
              <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" status="online" />
            </div>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}; 