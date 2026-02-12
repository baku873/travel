"use client";
import { useState, useEffect } from "react";
import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGoogle, FaFacebookF, FaPlane, FaArrowRight } from "react-icons/fa";
// 👇 1. Import Hook
import { useLanguage } from "../../context/LanguageContext";

const SignInPage = () => {
  // 👇 2. Get Language
  const { language } = useLanguage();

  const { isLoaded, signIn, setActive } = useSignIn();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 👇 3. Define Translations
  const content = {
    mn: {
      brand: "Euro trails",
      heroTitle: "Шинэ аялалд нэгдээрэй.",
      heroDesc: "Нэвтэрснээр та манай бүх боломжуудыг ашиглах боломжтой болно.",
      formTitle: "Нэвтрэх",
      formDesc: "Бүртгэлтэй хаягаараа нэвтрэх",
      socialGoogle: "Google-р нэвтрэх",
      socialFacebook: "Facebook-р нэвтрэх",
      divider: "ЭСВЭЛ",
      emailPlaceholder: "И-мэйл хаяг",
      passwordPlaceholder: "Нууц үг",
      btnLoading: "Нэвтэрч байна...",
      btnDefault: "Нэвтрэх",
      noAccount: "Бүртгэлгүй юу?",
      signUp: "Бүртгүүлэх",
      errorGeneric: "Алдаа гарлаа. Дахин оролдоно уу."
    },
    en: {
      brand: "Euro trails",
      heroTitle: "Join the new journey.",
      heroDesc: "Sign in to access all our features and book your next trip.",
      formTitle: "Sign In",
      formDesc: "Login with your registered account",
      socialGoogle: "Sign in with Google",
      socialFacebook: "Sign in with Facebook",
      divider: "OR",
      emailPlaceholder: "Email address",
      passwordPlaceholder: "Password",
      btnLoading: "Signing in...",
      btnDefault: "Sign In",
      noAccount: "Don't have an account?",
      signUp: "Sign Up",
      errorGeneric: "An unexpected error occurred."
    },
    ko: {
      brand: "Euro trails",
      heroTitle: "새로운 여정에 참여하세요.",
      heroDesc: "로그인하여 모든 기능에 액세스하고 다음 여행을 예약하세요.",
      formTitle: "로그인",
      formDesc: "등록된 계정으로 로그인",
      socialGoogle: "Google로 로그인",
      socialFacebook: "Facebook로 로그인",
      divider: "또는",
      emailPlaceholder: "이메일 주소",
      passwordPlaceholder: "비밀번호",
      btnLoading: "로그인 중...",
      btnDefault: "로그인",
      noAccount: "계정이 없으신가요?",
      signUp: "가입하기",
      errorGeneric: "예기치 않은 오류가 발생했습니다."
    }
  };

  const t = content[language];

  useEffect(() => {
    if (userLoaded && user) {
      router.push("/");
    }
  }, [userLoaded, user, router]);

  // --- Handle Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.longMessage || t.errorGeneric;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handle Social Logins ---
  const handleSocialSignIn = async (strategy: "oauth_google" | "oauth_facebook") => {
    if (!isLoaded) return;
    setIsLoading(true);
    setError("");
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: `/${language}/sso-callback`,
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.longMessage || t.errorGeneric;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover filter brightness-50">
          <source src="https://res.cloudinary.com/dc127wztz/video/upload/hero_uzq5wr.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Column: Hero Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white text-center lg:text-left hidden lg:block"
        >
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="bg-sky-500 text-white p-2 rounded-lg">
              <FaPlane size={20} />
            </div>
            <span className="text-2xl font-black tracking-tight">
              {t.brand}
            </span>
          </Link>
          <h1 className="text-5xl font-black leading-tight mb-4">
            {t.heroTitle}
          </h1>
          <p className="text-slate-300 text-lg">
            {t.heroDesc}
          </p>
        </motion.div>

        {/* Right Column: Sign-In Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-2">{t.formTitle}</h2>
            <p className="text-slate-400 mb-8">
              {t.formDesc}
            </p>

            {/* Social Logins */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <SocialButton
                icon={FaGoogle}
                text={t.socialGoogle}
                onClick={() => handleSocialSignIn("oauth_google")}
                disabled={isLoading}
              />
              <SocialButton
                icon={FaFacebookF}
                text={t.socialFacebook}
                onClick={() => handleSocialSignIn("oauth_facebook")}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center gap-4 mb-8">
              <hr className="flex-1 border-slate-700" />
              <span className="text-slate-500 text-xs font-bold">{t.divider}</span>
              <hr className="flex-1 border-slate-700" />
            </div>

            {/* Sign-In Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormInput
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg flex items-center justify-center group"
              >
                {isLoading ? t.btnLoading : t.btnDefault}
                {!isLoading && (
                  <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                )}
              </motion.button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-8">
              {t.noAccount}{" "}
              <Link href="/sign-up" className="font-bold text-sky-400 hover:underline">
                {t.signUp}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Helper Components ─── */
const FormInput = ({ type, placeholder, value, onChange }: { type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="relative">
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="peer w-full bg-slate-800/50 border-2 border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-all"
    />
    <div className="absolute inset-0 rounded-lg border-2 border-transparent peer-focus:border-sky-500 pointer-events-none -z-10 blur group-focus:opacity-100 opacity-0 transition-opacity duration-300"
      style={{ background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.2), transparent 80%)' }} />
  </div>
);

const SocialButton = ({ icon: Icon, text, onClick, disabled }: { icon: any; text: string; onClick: () => void; disabled: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="flex-1 flex items-center justify-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-white hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Icon />
    {text}
  </button>
);

export default SignInPage;