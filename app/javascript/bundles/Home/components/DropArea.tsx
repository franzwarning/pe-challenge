import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import debounce from 'lodash.debounce'
import * as React from 'react'
export function DropArea() {
    const [dropIconVisible, setDropIconVisible] = React.useState(false)

    const xValue = useMotionValue(0)
    const xSpring = useSpring(xValue, { bounce: 0.3 })
    const yValue = useMotionValue(0)
    const ySpring = useSpring(yValue, { bounce: 0.3 })

    const setMotionValues = React.useCallback((x: number, y: number) => {
        if (xValue.get() !== x || yValue.get() !== y) {
            console.log(`setMotionValues (${x}, ${y})`)

            xValue.set(x)
            yValue.set(y)
        }
    }, [])
    const debouncedSetFn = React.useMemo(
        () => debounce(setMotionValues, 100, { maxWait: 100, leading: true, trailing: true }),
        []
    )

    return (
        <div
            className="absolute inset-0 z-0"
            onDragEnter={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('drag enter')
                setDropIconVisible(true)
            }}
            onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()

                debouncedSetFn(e.clientX, e.clientY)
            }}
            onDragLeave={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('drag leave')
                setDropIconVisible(false)
            }}
            onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('drop')
                setDropIconVisible(false)
            }}
        >
            <div className="w-full h-full relative">
                <AnimatePresence>
                    {dropIconVisible && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute w-20 h-20 bg-gray-200 border-gray-400 rounded-xl border touch-none select-none pointer-events-none"
                            style={{
                                x: xSpring,
                                y: ySpring,
                                translateX: '-50%',
                                translateY: '-50%'
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>
            <form>
                <input type="file" hidden />
            </form>
        </div>
    )
}
