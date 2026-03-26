import * as Dialog from "@radix-ui/react-dialog";

export default function Example() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-black text-white rounded">
          Open modal
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded">
          <Dialog.Title className="text-lg font-bold">
            Hello 👋
          </Dialog.Title>
          <Dialog.Description>
            This modal is fully accessible by default.
          </Dialog.Description>

          <Dialog.Close asChild>
            <button className="mt-4 border px-3 py-1 rounded">
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
