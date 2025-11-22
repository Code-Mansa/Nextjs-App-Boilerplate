// src/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/services/endpoints";
import { useInactivityLogout } from "./useInactivityLogout";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login" || pathname === "/register";

  // 1. Check session
  const { data: user, isLoading: queryLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.me().then((res) => res.data.user),
    retry: false,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: !isLoginPage,
    enabled: !isLoginPage, // Don't run on login/register
  });

  // 2. Login mutation with auto-redirect
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: () => {
      // Invalidate and refetch user
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      // Redirect to dashboard (or intended page)
      router.push("/dashboard");
      router.refresh(); // Optional: force refresh to update server components
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // Optional: show toast
    },
  });

  // 3. Logout
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      router.push("/login");
      queryClient.clear();
    },
  });

  // 4. Inactivity logout
  useInactivityLogout(!!user && !isLoginPage);

  // Optional: Auto-redirect if logged in and on login page
  useEffect(() => {
    if (user && isLoginPage) {
      router.replace("/dashboard");
    }
  }, [user, isLoginPage, router]);

  return {
    user: user || null,
    isLoading: queryLoading && !isLoginPage,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
