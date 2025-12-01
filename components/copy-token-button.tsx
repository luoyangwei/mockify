"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CopyTokenButtonProps {
    token: string;
}

export function CopyTokenButton({ token }: CopyTokenButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("复制失败:", error);
        }
    };

    return (
        <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? "已复制" : "复制"}
        </Button>
    );
}

