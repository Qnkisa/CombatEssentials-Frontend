import Modal from "./Modal";

export const LoginModal = (props: {
    state: true | undefined,
    onSuccess: () => void,
    onClose: () => void,
})=> {
    return <Modal state={props.state} onClose={props.onClose}>
        {(state) => {
          return <div>
              Login modal.
          </div>
        }}
    </Modal>
}

