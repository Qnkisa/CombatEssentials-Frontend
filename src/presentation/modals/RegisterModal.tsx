import { createSignal } from "solid-js";
import Modal from "./Modal";
import { RemoteRepositoryImpl } from "../../repository/RemoteRepositoryImpl";

const repo = new RemoteRepositoryImpl();

export const RegisterModal = (props: {
    state: boolean | undefined;
    onSuccess: () => void;
    onClose: () => void;
}) => {
    const [firstName, setFirstName] = createSignal("");
    const [lastName, setLastName] = createSignal("");
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [error, setError] = createSignal<string | null>(null);

    const onSubmit = async () => {
        setError(null);
        try {
            await repo.register(
                firstName().trim(),
                lastName().trim(),
                email().trim(),
                password()
            );
            props.onSuccess();
        } catch (err) {
            setError("Грешка при регистрация. Опитайте отново.");
            console.error(err);
        }
    };

    return (
        <Modal state={props.state} onClose={props.onClose}>
            {(state) => (
                <div class="max-h-[90vh] overflow-y-auto w-[300px] sm:w-[30rem] bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative text-gray-800">
                    {/* Close button */}
                    <button
                        type="button"
                        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                        onClick={props.onClose}
                    >
                        &times;
                    </button>

                    <form
                        class="flex flex-col gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmit();
                        }}
                    >
                        <h2 class="text-xl sm:text-2xl font-semibold text-center mb-2">Регистрация</h2>

                        <input
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Име"
                            value={firstName()}
                            onInput={(e) => setFirstName(e.currentTarget.value)}
                            required
                        />

                        <input
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Фамилия"
                            value={lastName()}
                            onInput={(e) => setLastName(e.currentTarget.value)}
                            required
                        />

                        <input
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="email"
                            placeholder="Имейл"
                            value={email()}
                            onInput={(e) => setEmail(e.currentTarget.value)}
                            required
                        />

                        <input
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="password"
                            placeholder="Парола"
                            value={password()}
                            onInput={(e) => setPassword(e.currentTarget.value)}
                            required
                        />

                        {error() && (
                            <p class="text-red-500 text-sm text-center">{error()}</p>
                        )}

                        <button
                            type="submit"
                            class="w-full bg-blue-600 text-white rounded-lg py-2 text-sm sm:text-base font-medium hover:bg-blue-700 transition cursor-pointer"
                        >
                            Регистрация
                        </button>
                    </form>
                </div>
            )}
        </Modal>
    );
};
