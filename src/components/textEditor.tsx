import React, { useState, useRef, useEffect } from "react"
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"
import { Undo, Redo } from "lucide-react"

export default function RichTextEditor({ adMessage, setAdMessage, adImage, setAdImage }: any) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [history, setHistory] = useState<string[]>([""])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null)

  // Save current content to history stack and sync with adMessage
  const saveHistory = () => {
    if (!editorRef.current) return
    const html = editorRef.current.innerHTML
    if (html === history[historyIndex]) return // no change

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(html)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setAdMessage(html) // Sync with parent state
  }

  // Image upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) return;

    setSelectedImageName(file.name);
    setAdImage(file); // <-- store the actual File object
  };

  // Apply execCommand action
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    saveHistory()
    updateFormatState()
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      if (editorRef.current) {
        const html = history[newIndex]
        editorRef.current.innerHTML = html
        setAdMessage(html)
      }
      updateFormatState()
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      if (editorRef.current) {
        const html = history[newIndex]
        editorRef.current.innerHTML = html
        setAdMessage(html)
      }
      updateFormatState()
    }
  }

  const onInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      setAdMessage(html)
      saveHistory()
      updateFormatState()
    }
  }

  const updateFormatState = () => {
    setIsBold(document.queryCommandState("bold"))
    setIsItalic(document.queryCommandState("italic"))
    setIsUnderline(document.queryCommandState("underline"))
  }

  useEffect(() => {
    const handler = () => updateFormatState()
    document.addEventListener("selectionchange", handler)
    return () => document.removeEventListener("selectionchange", handler)
  }, [])

  const onEmojiClick = (emojiData: EmojiClickData) => {
    if (!editorRef.current) return

    const emoji = emojiData.emoji
    const sel = window.getSelection()
    let range: Range | null = null

    const isSelectionInsideEditor = () => {
      if (!sel || sel.rangeCount === 0) return false
      let node = sel.anchorNode
      while (node) {
        if (node === editorRef.current) return true
        node = node.parentNode
      }
      return false
    }

    if (!isSelectionInsideEditor()) {
      editorRef.current.focus()
      const childNodes = editorRef.current.childNodes
      range = document.createRange()
      if (childNodes.length > 0) {
        range.setStartAfter(childNodes[childNodes.length - 1])
      } else {
        range.setStart(editorRef.current, 0)
      }
      range.collapse(true)
      sel?.removeAllRanges()
      sel?.addRange(range)
    } else {
      range = sel!.getRangeAt(0)
    }

    range.deleteContents()
    const emojiNode = document.createTextNode(emoji)
    range.insertNode(emojiNode)
    range.setStartAfter(emojiNode)
    range.collapse(true)
    sel?.removeAllRanges()
    sel?.addRange(range)

    saveHistory()
    updateFormatState()
  }

  // Initialize editor content from adMessage
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = adMessage || ""
      setHistory([adMessage || ""])
      setHistoryIndex(0)
    }
  }, [])

  // Sync changes to adMessage externally
  useEffect(() => {
    if (editorRef.current && adMessage !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = adMessage
    }
  }, [adMessage])

  return (
    <div className="w-full lg:h-full h-full pb-2 lg:p-4 px-4 pt-4 border rounded-md shadow-md relative">
      <div className="mb-2 flex flex-wrap gap-2 w-full">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className={`px-3 py-1 rounded ${isBold ? "bg-blue-400 text-white" : "bg-gray-200"
            }`}
          title="Bold"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className={`px-3 py-1 rounded ${isItalic ? "bg-blue-400 text-white" : "bg-gray-200"
            }`}
          title="Italic"
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className={`px-3 py-1 rounded ${isUnderline ? "bg-blue-400 text-white" : "bg-gray-200"
            }`}
          title="Underline"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={undo}
          disabled={historyIndex === 0}
          className="px-2 py-2 bg-gray-200 rounded disabled:opacity-50"
          title="Undo"
        >
          <Undo className="size-5"/>
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={historyIndex === history.length - 1}
          className="px-2 py-2 bg-gray-200 rounded disabled:opacity-50"
          title="Redo"
        >
          <Redo className="size-5"/>
        </button>
        <button
          type="button"
          onClick={() => setShowEmojiPicker((v) => !v)}
          className="px-3 py-1 bg-yellow-200 rounded"
          title="Emoji Picker"
        >
          😊
        </button>
        <label className="px-3 py-1 bg-gray-200 rounded cursor-pointer" title="Upload Image">
          📷
          <input
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
        {selectedImageName && (
          <span className="ml-2 text-sm font-semibold self-center text-gray-600 truncate max-w-[120px]">{selectedImageName}</span>
        )}
      </div>

      <div
        ref={editorRef}
        contentEditable
        onClick={() => setShowEmojiPicker(false)}
        onInput={onInput}
        className="h-[92%] w-full bg-[#fcf8f4] border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300 overflow-y-scroll"
        spellCheck={true}
        suppressContentEditableWarning={true}
        aria-label="Rich text editor"
        style={{ whiteSpace: "pre-wrap" }}
      />

      {showEmojiPicker && (
        <div className="mt-2 lg:absolute fixed top-14 right-2 z-20">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  )
}
