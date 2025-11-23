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

  const isLoginPage = pathname === "/login" || pathname === "/signup";

  const { data: user, isLoading: queryLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.me().then((res) => res.data.user),
    retry: false,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: !isLoginPage,
    enabled: !isLoginPage,
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      // Automatically invalidate user query to fetch the new user
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  // PERFECT LOGOUT: Clear cache FIRST → then redirect
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onMutate: async () => {
      // Prevent queries from updating during logout
      await queryClient.cancelQueries({ queryKey: ["auth", "me"] });
    },
    onSuccess: () => {
      // Redirect immediately
      router.push("/login");

      // Only clear cache after a short delay to ensure unmount
      setTimeout(() => {
        queryClient.clear();
      }, 100); // 100ms is enough for route change
    },
  });

  useInactivityLogout(!!user && !isLoginPage);

  useEffect(() => {
    if (user && isLoginPage) {
      router.replace("/dashboard");
    }
  }, [user, isLoginPage, router]);

  return {
    user: user || null,
    isLoading: queryLoading && !isLoginPage,
    isAuthenticated: !!user,
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isRegisterError: registerMutation.isError,
  };
}
