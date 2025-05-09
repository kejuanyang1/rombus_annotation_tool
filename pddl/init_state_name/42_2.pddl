(define (problem scene)
  (:domain manip)
  (:objects
    flat red block_1 flat red block_2 - support
    large red triangular prism - item
    long yellow block - support
    blue cylinder - item
    flat green block_1 flat green block_2 - support
  )
  (:init
    (ontable flat red block_1)
    (ontable flat red block_2)
    (ontable long yellow block)
    (ontable flat green block_1)
    (ontable flat green block_2)
    (on large red triangular prism long yellow block)
    (on blue cylinder flat green block_1)
    (clear flat red block_1)
    (clear flat red block_2)
    (clear large red triangular prism)
    (clear blue cylinder)
    (clear flat green block_2)
    (handempty)
  )
  (:goal (and))
)