(define (problem scene1)
  (:domain manip)
  (:objects
    flat red block_1 - support
    flat red block_2 - support
    large red triangular prism - item
    long yellow block - support
    blue cylinder - item
    flat green block_1 - support
    flat green block_2 - support
  )
  (:init
    (ontable flat red block_1)
    (ontable flat red block_2)
    (ontable large red triangular prism)
    (ontable long yellow block)
    (ontable flat green block_1)
    (ontable flat green block_2)
    (on blue cylinder flat red block_2)
    (handempty)
  )
  (:goal (and ))
)