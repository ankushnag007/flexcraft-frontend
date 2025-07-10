"use client"
import AuthGuard from "@/app/components/AuthGuard";

export default function ProjectReports() {
    return (
        <AuthGuard>
            <div>
                <h1>Project Reports</h1>
            </div>
        </AuthGuard>
    );
}