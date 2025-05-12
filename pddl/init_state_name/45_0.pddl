(define (problem scene1)
  (:domain manip)
  (:objects
    small red cube_1 small red cube_2 - support
    long yellow block_1 long yellow block_2 - support
    yellow half cylinder - item
    long blue block - support
    blue cylinder - item
    big yellow shopping basket blue basket - container
  )
  (:init
    (in small red cube_1 big yellow shopping basket)
    (in small red cube_2 blue basket)
    (in long yellow block_1 big yellow shopping basket)
    (ontable long yellow block_2)
    (ontable yellow half cylinder)
    (ontable long blue block)
    (ontable blue cylinder)
    (clear long yellow block_2)
    (clear yellow half cylinder)
    (clear long blue block)
    (clear blue cylinder)
    (handempty)
  )
  (:goal (and))
)