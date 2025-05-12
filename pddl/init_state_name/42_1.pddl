(define (problem scene1)
  (:domain manip)
  (:objects
    flat red block_1 flat red block_2 large red triangular prism long yellow block blue cylinder flat green block_1 flat green block_2 - obj
  )
  (:init
    (ontable flat red block_1)
    (ontable large red triangular prism)
    (ontable long yellow block)
    (ontable blue cylinder)
    (ontable flat green block_1)
    (on flat red block_2 long yellow block)
    (on flat green block_2 flat red block_1)
    (handempty)
  )
  (:goal (and ))
)