import Modal from "./Modal";

export const RegisterModal = (props: {
    state: true | undefined,
    onSuccess: () => void,
    onClose: () => void,
})=> {
    return <Modal state={props.state} onClose={props.onClose}>
        {(state) => {
            return <div>
                Register modal.
            </div>
        }}
    </Modal>
}

