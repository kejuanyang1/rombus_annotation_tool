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
    (ontable small red cube_2)
    (ontable long blue block)
    (ontable blue cylinder)
    (on long yellow block_1 small red cube_1)
    (in yellow half cylinder blue basket)
    (in long yellow block_2 big yellow shopping basket)
    (closed big yellow shopping basket)
    (closed blue basket)
    (clear long yellow block_1)
    (clear small red cube_2)
    (clear long blue block)
    (clear blue cylinder)
    (handempty)
  )
  (:goal (and ))
)