'use client';

import { useState } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, Input, Badge, Avatar, DatePicker, ProgressBar, Dialog, CurrencyInput, TransactionCard, TransactionDetail, FinancialSummaryCard, AccountSelector, CategorySelector } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';
import { ArrowUpDown, DollarSign, TrendingUp, Wallet, CreditCard } from 'lucide-react';

interface UIShowcasePageProps {
  params: {
    locale: Locale;
  };
}

// Sample transaction data for showcase
const sampleTransactions = [
  {
    id: '1',
    description: 'Grocery Shopping',
    amount: -7850, // -$78.50
    date: new Date('2023-05-10'),
    category: 'Food',
    type: 'expense',
    account: 'Main Checking'
  },
  {
    id: '2',
    description: 'Salary Deposit',
    amount: 250000, // $2,500.00
    date: new Date('2023-05-01'),
    category: 'Income',
    type: 'income',
    account: 'Main Checking'
  },
  {
    id: '3',
    description: 'Rent Payment',
    amount: -120000, // -$1,200.00
    date: new Date('2023-05-05'),
    category: 'Housing',
    type: 'expense',
    account: 'Main Checking'
  },
  {
    id: '4',
    description: 'Transfer to Savings',
    amount: -50000, // -$500.00
    date: new Date('2023-05-15'),
    category: 'Transfer',
    type: 'transfer',
    account: 'Main Checking',
    destinationAccount: 'Savings Account'
  }
];

export const UIShowcasePage = ({ params }: UIShowcasePageProps) => {
  const [inputValue, setInputValue] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [currencyValue, setCurrencyValue] = useState(1050); // $10.50
  const { locale } = params;

  // For AccountSelector demo
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>('1');
  const demoAccounts = [
    { id: '1', name: 'Cash', balance: 1500, currency: 'USD', color: '#4CAF50' },
    { id: '2', name: 'Credit Card', balance: 3245.75, currency: 'USD', color: '#2196F3' },
    { id: '3', name: 'Savings', balance: 10000, currency: 'USD', color: '#FFC107' },
    { id: '4', name: 'Investment', balance: 25000, currency: 'USD', color: '#9C27B0' },
  ];

  // For CategorySelector demo
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>('1');
  const demoCategories = [
    { id: '1', name: 'Groceries', icon: '🛒', color: '#4CAF50', type: 'expense' as const },
    { id: '2', name: 'Dining', icon: '🍔', color: '#FF9800', type: 'expense' as const },
    { id: '3', name: 'Transport', icon: '🚗', color: '#2196F3', type: 'expense' as const },
    { id: '4', name: 'Salary', icon: '💰', color: '#9C27B0', type: 'income' as const },
    { id: '5', name: 'Investments', icon: '📈', color: '#F44336', type: 'both' as const },
  ];

  const handleDialogAction = () => {
    setDialogAction('Primary action clicked');
    setIsDialogOpen(false);
  };

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

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Date Picker</h2>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-medium">Date Selection Component</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DatePicker
                label="Standard Date Picker"
                value={date}
                onChange={setDate}
                locale={locale}
              />
              
              <DatePicker
                label="With Helper Text"
                value={date}
                onChange={setDate}
                helperText="Select a date for the transaction"
                locale={locale}
              />
              
              <DatePicker
                label="With Error"
                value={date}
                onChange={setDate}
                error="Date is required"
                locale={locale}
              />
              
              <DatePicker
                label="Disabled Date Picker"
                value={date}
                onChange={setDate}
                disabled
                locale={locale}
              />
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Currency Input</h2>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-medium">Currency Input Component</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CurrencyInput
                  label="Standard Currency Input"
                  value={currencyValue}
                  onChange={setCurrencyValue}
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Value in cents: {currencyValue} (${(currencyValue / 100).toFixed(2)})
                </p>
              </div>
              
              <CurrencyInput
                label="With Helper Text"
                value={currencyValue}
                onChange={setCurrencyValue}
                helperText="Enter the transaction amount"
              />
              
              <CurrencyInput
                label="With Error"
                value={currencyValue}
                onChange={setCurrencyValue}
                error="Amount is required"
              />
              
              <CurrencyInput
                label="Disabled Currency Input"
                value={currencyValue}
                onChange={setCurrencyValue}
                disabled
              />
              
              <CurrencyInput
                label="Custom Currency Symbol (€)"
                value={currencyValue}
                onChange={setCurrencyValue}
                currencySymbol="€"
              />
              
              <CurrencyInput
                label="Without Decimals"
                value={currencyValue}
                onChange={setCurrencyValue}
                showDecimals={false}
              />
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Dialog</h2>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-medium">Dialog Component</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div>
                <Button 
                  variant="primary" 
                  onClick={() => setIsDialogOpen(true)}
                >
                  Open Dialog
                </Button>
                
                <Dialog
                  isOpen={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)}
                  title="Confirm Transaction"
                  primaryActionText="Confirm"
                  onPrimaryAction={handleDialogAction}
                >
                  <div className="space-y-4">
                    <p>Are you sure you want to complete this transaction?</p>
                    
                    <div className="bg-card-hover p-4 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">${(currencyValue / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{date?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">Groceries</span>
                      </div>
                    </div>
                    
                    {dialogAction && (
                      <div className="mt-4 p-2 bg-success/10 text-success rounded">
                        {dialogAction}
                      </div>
                    )}
                  </div>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardBody>
                    <h4 className="font-medium mb-2">Dialog Sizes</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        Small
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        Medium
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        Large
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        Extra Large
                      </Button>
                    </div>
                  </CardBody>
                </Card>
                
                <Card>
                  <CardBody>
                    <h4 className="font-medium mb-2">Dialog Use Cases</h4>
                    <p className="text-muted-foreground text-sm">
                      Dialogs are useful for:
                    </p>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-muted-foreground">
                      <li>Confirmation actions</li>
                      <li>Form submission</li>
                      <li>Displaying critical information</li>
                      <li>Multi-step processes</li>
                    </ul>
                  </CardBody>
                </Card>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Progress Bars</h2>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-medium">Progress Visualization Component</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Basic Progress</h4>
                <ProgressBar value={65} />
              </div>
              
              <div>
                <h4 className="font-medium mb-2">With Label</h4>
                <ProgressBar value={42} showLabel />
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Different Sizes</h4>
                <div className="space-y-4">
                  <ProgressBar value={30} size="sm" showLabel />
                  <ProgressBar value={50} size="md" showLabel />
                  <ProgressBar value={70} size="lg" showLabel />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Different Variants</h4>
                <div className="space-y-4">
                  <ProgressBar value={88} variant="primary" showLabel />
                  <ProgressBar value={72} variant="success" showLabel />
                  <ProgressBar value={45} variant="warning" showLabel />
                  <ProgressBar value={20} variant="error" showLabel />
                  <ProgressBar value={60} variant="info" showLabel />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Financial Goals Example</h4>
                <div className="space-y-4">
                  <ProgressBar 
                    value={3500} 
                    max={5000} 
                    showLabel 
                    variant="primary" 
                    label="Monthly Savings Goal" 
                  />
                  <ProgressBar 
                    value={2750} 
                    max={3000} 
                    showLabel 
                    variant="warning" 
                    label="Budget Utilization" 
                  />
                  <ProgressBar 
                    value={12000} 
                    max={50000} 
                    showLabel 
                    variant="success" 
                    label="Debt Repayment Progress" 
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Transaction Cards</h2>
        <div className="space-y-4">
          {sampleTransactions.map(transaction => (
            <TransactionCard 
              key={transaction.id}
              id={transaction.id}
              description={transaction.description}
              amount={transaction.amount}
              date={transaction.date}
              category={transaction.category}
              type={transaction.type as 'income' | 'expense' | 'transfer' | 'debt'}
              account={transaction.account}
              onClick={() => alert(`Clicked on transaction: ${transaction.description}`)}
            />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Transaction Detail</h2>
        <TransactionDetail 
          id={sampleTransactions[0].id}
          description={sampleTransactions[0].description}
          amount={sampleTransactions[0].amount}
          date={sampleTransactions[0].date}
          category={sampleTransactions[0].category}
          type={sampleTransactions[0].type as 'income' | 'expense' | 'transfer' | 'debt'}
          account={sampleTransactions[0].account}
          notes="This was a weekly grocery run at Whole Foods. Bought ingredients for meal prep."
          onEdit={() => alert('Edit clicked')}
          onDelete={() => alert('Delete clicked')}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Financial Summary Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <FinancialSummaryCard 
            title="Total Balance"
            value={5280.75}
            subtitle="Across all accounts"
            icon={<Wallet size={20} />}
            change={{ value: 12.5, positive: true }}
            trendData={[5100, 5150, 5220, 5180, 5240, 5280]}
          />
          
          <FinancialSummaryCard 
            title="Monthly Income"
            value={3500.00}
            subtitle="May 2023"
            icon={<DollarSign size={20} />}
            change={{ value: 500, positive: true }}
            trendData={[2800, 3000, 2900, 3200, 3500]}
          />
          
          <FinancialSummaryCard 
            title="Monthly Expenses"
            value={2175.35}
            subtitle="May 2023"
            icon={<ArrowUpDown size={20} />}
            change={{ value: 125.40, positive: false }}
            trendData={[1800, 1950, 2050, 2175]}
          />
          
          <FinancialSummaryCard 
            title="Savings Goal"
            value={4000.00}
            subtitle="Vacation Fund"
            icon={<TrendingUp size={20} />}
            footer={
              <ProgressBar 
                value={2500}
                max={4000}
                showLabel
                size="sm"
                variant="success"
              />
            }
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Account Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="overflow-hidden">
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="text-primary-500" size={20} />
                <h3 className="text-lg font-medium">Main Checking</h3>
              </div>
              <Badge variant="primary">Active</Badge>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Available balance</span>
                <span className="text-2xl font-bold text-foreground">$3,245.65</span>
                
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account number</span>
                    <span>•••• 4567</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last updated</span>
                    <span>Today, 10:32 AM</span>
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline" size="sm">Transfer</Button>
                <Button variant="primary" size="sm">View Transactions</Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="text-primary-500" size={20} />
                <h3 className="text-lg font-medium">Savings Account</h3>
              </div>
              <Badge variant="success">Active</Badge>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Available balance</span>
                <span className="text-2xl font-bold text-foreground">$12,500.00</span>
                
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account number</span>
                    <span>•••• 7890</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last updated</span>
                    <span>Today, 10:32 AM</span>
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline" size="sm">Transfer</Button>
                <Button variant="primary" size="sm">View Transactions</Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="text-error" size={20} />
                <h3 className="text-lg font-medium">Credit Card</h3>
              </div>
              <Badge variant="error">Active</Badge>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Current balance</span>
                <span className="text-2xl font-bold text-error">-$1,756.33</span>
                
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available credit</span>
                    <span>$3,243.67</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next payment date</span>
                    <span>Jun 15, 2023</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Minimum payment</span>
                    <span>$35.00</span>
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline" size="sm">Pay Balance</Button>
                <Button variant="primary" size="sm">View Transactions</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* AccountSelector Showcase */}
      <section className="mb-10" id="account-selector">
        <h2 className="text-2xl font-semibold mb-4">Account Selector</h2>
        <p className="mb-4">A specialized component for selecting financial accounts.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <h3 className="text-xl font-medium mb-2">Default</h3>
            <Card className="p-4">
              <AccountSelector 
                accounts={demoAccounts}
                selectedAccountId={selectedAccountId}
                onChange={setSelectedAccountId}
                label="Select account"
              />
            </Card>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Code Example</h4>
              <pre className="bg-card p-4 rounded overflow-x-auto">
                {`<AccountSelector 
  accounts={accounts}
  selectedAccountId={selectedAccountId}
  onChange={setSelectedAccountId}
  label="Select account"
/>`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">With Error State</h3>
            <Card className="p-4">
              <AccountSelector 
                accounts={demoAccounts}
                selectedAccountId={selectedAccountId}
                onChange={setSelectedAccountId}
                label="Select account"
                required
                error="Please select an account"
              />
            </Card>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Code Example</h4>
              <pre className="bg-card p-4 rounded overflow-x-auto">
                {`<AccountSelector 
  accounts={accounts}
  selectedAccountId={selectedAccountId}
  onChange={setSelectedAccountId}
  label="Select account"
  required
  error="Please select an account"
/>`}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-medium mb-2">Properties</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-accent">
                  <th className="border border-border p-2 text-left">Prop</th>
                  <th className="border border-border p-2 text-left">Type</th>
                  <th className="border border-border p-2 text-left">Default</th>
                  <th className="border border-border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">accounts</td>
                  <td className="border border-border p-2">Account[]</td>
                  <td className="border border-border p-2">Required</td>
                  <td className="border border-border p-2">Array of account objects</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">selectedAccountId</td>
                  <td className="border border-border p-2">string {'|'} undefined</td>
                  <td className="border border-border p-2">undefined</td>
                  <td className="border border-border p-2">ID of the selected account</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">onChange</td>
                  <td className="border border-border p-2">(accountId: string) {'=>'} void</td>
                  <td className="border border-border p-2">Required</td>
                  <td className="border border-border p-2">Callback when selection changes</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">label</td>
                  <td className="border border-border p-2">string</td>
                  <td className="border border-border p-2">undefined</td>
                  <td className="border border-border p-2">Label for the selector</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">placeholder</td>
                  <td className="border border-border p-2">&quot;Select account&quot;</td>
                  <td className="border border-border p-2">&quot;Select account&quot;</td>
                  <td className="border border-border p-2">Placeholder text when nothing selected</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">disabled</td>
                  <td className="border border-border p-2">boolean</td>
                  <td className="border border-border p-2">false</td>
                  <td className="border border-border p-2">Whether the selector is disabled</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">required</td>
                  <td className="border border-border p-2">boolean</td>
                  <td className="border border-border p-2">false</td>
                  <td className="border border-border p-2">Whether selection is required</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">error</td>
                  <td className="border border-border p-2">string</td>
                  <td className="border border-border p-2">undefined</td>
                  <td className="border border-border p-2">Error message to display</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CategorySelector Showcase */}
      <section className="mb-10" id="category-selector">
        <h2 className="text-2xl font-semibold mb-4">Category Selector</h2>
        <p className="mb-4">A specialized component for selecting transaction categories.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <h3 className="text-xl font-medium mb-2">Default (Expense)</h3>
            <Card className="p-4">
              <CategorySelector 
                categories={demoCategories}
                selectedCategoryId={selectedCategoryId}
                onChange={setSelectedCategoryId}
                label="Select category"
                transactionType="expense"
              />
            </Card>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Code Example</h4>
              <pre className="bg-card p-4 rounded overflow-x-auto">
                {`<CategorySelector 
  categories={categories}
  selectedCategoryId={selectedCategoryId}
  onChange={setSelectedCategoryId}
  label="Select category"
  transactionType="expense"
/>`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Income Categories</h3>
            <Card className="p-4">
              <CategorySelector 
                categories={demoCategories}
                selectedCategoryId={selectedCategoryId}
                onChange={setSelectedCategoryId}
                label="Select category"
                transactionType="income"
              />
            </Card>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Code Example</h4>
              <pre className="bg-card p-4 rounded overflow-x-auto">
                {`<CategorySelector 
  categories={categories}
  selectedCategoryId={selectedCategoryId}
  onChange={setSelectedCategoryId}
  label="Select category"
  transactionType="income"
/>`}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-medium mb-2">Properties</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-accent">
                  <th className="border border-border p-2 text-left">Prop</th>
                  <th className="border border-border p-2 text-left">Type</th>
                  <th className="border border-border p-2 text-left">Default</th>
                  <th className="border border-border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">categories</td>
                  <td className="border border-border p-2">Category[]</td>
                  <td className="border border-border p-2">Required</td>
                  <td className="border border-border p-2">Array of category objects</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">selectedCategoryId</td>
                  <td className="border border-border p-2">string {'|'} undefined</td>
                  <td className="border border-border p-2">undefined</td>
                  <td className="border border-border p-2">ID of the selected category</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">onChange</td>
                  <td className="border border-border p-2">(categoryId: string) {'=>'} void</td>
                  <td className="border border-border p-2">Required</td>
                  <td className="border border-border p-2">Callback when selection changes</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">transactionType</td>
                  <td className="border border-border p-2">&apos;income&apos; {'|'} &apos;expense&apos; {'|'} &apos;transfer&apos; {'|'} &apos;debt&apos;</td>
                  <td className="border border-border p-2">&apos;expense&apos;</td>
                  <td className="border border-border p-2">Type of transaction to filter categories for</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">label</td>
                  <td className="border border-border p-2">string</td>
                  <td className="border border-border p-2">undefined</td>
                  <td className="border border-border p-2">Label for the selector</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">placeholder</td>
                  <td className="border border-border p-2">&quot;Select category&quot;</td>
                  <td className="border border-border p-2">&quot;Select category&quot;</td>
                  <td className="border border-border p-2">Placeholder text when nothing selected</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">showSearch</td>
                  <td className="border border-border p-2">boolean</td>
                  <td className="border border-border p-2">true</td>
                  <td className="border border-border p-2">Whether to show search input for categories</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">disabled</td>
                  <td className="border border-border p-2">boolean</td>
                  <td className="border border-border p-2">false</td>
                  <td className="border border-border p-2">Whether the selector is disabled</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}; 