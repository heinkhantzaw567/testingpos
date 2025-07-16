# POS System

A modern Point of Sale (POS) system built with Next.js, React, and Tailwind CSS.

## 🚀 Features

### Dashboard
- **Overview Statistics**: Total sales, orders, products, and customers
- **Recent Activities**: Latest orders and transactions
- **Performance Metrics**: Revenue trends and analytics

### Orders Management
- **Order Tracking**: View and manage all orders
- **Order Creation**: Create new orders with product selection
- **Payment Processing**: Multiple payment methods support
- **Order History**: Complete order tracking and history

### Products Management
- **Product Catalog**: Comprehensive product inventory
- **CRUD Operations**: Add, view, edit, and delete products
- **Inventory Tracking**: Stock levels and low-stock alerts
- **Categories**: Organize products by categories

### Customers Management
- **Customer Database**: Manage customer information
- **Credit System**: Add and manage customer credits
- **Order History**: Track customer purchase history
- **Loyalty Points**: Customer loyalty program
- **Contact Management**: Email, phone, and address tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.3.5, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials in `.env.local`.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🎯 Future Enhancements

- [ ] Real-time inventory updates
- [ ] Advanced reporting and analytics
- [ ] Mobile app support
- [ ] Integration with payment gateways
- [ ] Multi-store support
- [ ] Barcode scanning
- [ ] Receipt printing
- [ ] Tax management
- [ ] Supplier management
- [ ] Employee management

---

**Built with ❤️ for modern retail businesses**
