import {useUserContext} from "../../../../util/context/UserContext";
import {onMount} from "solid-js";

export default function ProfileInfo() {
    const [user] = useUserContext();

    return (
        <div class="w-full min-h-screen bg-gray-50 px-4 py-10">
            <div>
                <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">Your Profile</h1>
                <div class="bg-white w-full max-w-md md:max-w-lg rounded-2xl shadow-lg p-6 space-y-6 mx-auto mt-10">
                    <div class="flex items-center space-x-4">
                        {/* Avatar with initials */}
                        <div
                            class="h-16 w-16 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-semibold uppercase">
                            {user()?.firstName?.[0]}{user()?.lastName?.[0]}
                        </div>
                        <div class="flex-1">
                            <h2 class="text-2xl font-bold text-gray-800">
                                {user()?.firstName} {user()?.lastName}
                            </h2>
                            <p class="text-sm text-gray-500">{user()?.email}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="bg-gray-100 rounded-lg p-4">
                            <p class="text-gray-500 text-sm">Username</p>
                            <p class="font-medium text-gray-800 break-words">{user()?.userName}</p>
                        </div>

                        <div class="bg-gray-100 rounded-lg p-4">
                            <p class="text-gray-500 text-sm">User ID</p>
                            <p class="font-mono text-xs text-gray-700 break-all">{user()?.id}</p>
                        </div>

                        <div class="bg-gray-100 rounded-lg p-4 sm:col-span-2">
                            <p class="text-gray-500 text-sm">Account Type</p>
                            <p class="font-medium text-gray-800">
                                {user()?.isAdmin ? (
                                    <span class="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                                    Admin
                                </span>
                                ) : (
                                    <span
                                        class="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                    Regular User
                                </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
