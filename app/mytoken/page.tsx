import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/get-session";
import { ensureUserToken } from "@/lib/token-utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-config";
import { CopyTokenButton } from "@/components/copy-token-button";

export default async function MyTokenPage() {
    const session = await getSession();

    // 如果用户未登录，重定向到登录页面
    if (!session?.user) {
        redirect("/login");
    }

    // 确保用户有 token，如果没有则创建一个
    const userId = Number.parseInt(session.user.id);
    const token = await ensureUserToken(userId);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-3xl">我的 API Token</CardTitle>
                        <CardDescription>
                            欢迎，{session.user.name} ({session.user.email})
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    您的 API Token
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 rounded-md bg-zinc-100 px-4 py-3 text-sm font-mono text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 break-all">
                                        {token.token}
                                    </code>
                                    <CopyTokenButton token={token.token} />
                                </div>
                                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                                    使用此 token 来访问 API 接口。请妥善保管，不要泄露给他人。
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t">
                            <form
                                action={async () => {
                                    "use server";
                                    await signOut({ redirectTo: "/login" });
                                }}
                            >
                                <Button type="submit" variant="outline">
                                    退出登录
                                </Button>
                            </form>
                            <Button variant="ghost" asChild>
                                <Link href="/">返回首页</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

