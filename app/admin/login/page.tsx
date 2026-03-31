import LoginForm from '@/components/admin/LoginForm';

export const metadata = { title: 'تسجيل الدخول' };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">لوحة التحكم</h1>
          <p className="text-slate-500">جريسكو تايرز - تسجيل الدخول</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
