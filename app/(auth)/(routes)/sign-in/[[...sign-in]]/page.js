import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Left Side: Brand Banner */}
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Car Nest Banner"
            src="/rolls-royce.png"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="hidden lg:relative lg:block lg:p-12 text-white">
            <h2 className="text-4xl font-bold sm:text-3xl md:text-5xl">
              Welcome to DriveNest
            </h2>
            <p className="mt-4  text-xl leading-relaxed text-white/90">
              Discover and list premium pre-owned and new cars in your area.
            </p>
          </div>
        </section>

        {/* Right Side: Clerk Auth Form */}
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <SignIn />
          </div>
        </main>
      </div>
    </section>
  );
}
