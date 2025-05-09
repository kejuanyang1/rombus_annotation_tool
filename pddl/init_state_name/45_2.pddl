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
    (ontable small red cube_1)
    (ontable small red cube_2)
    (ontable long yellow block_1)
    (ontable long yellow block_2)
    (ontable yellow half cylinder)
    (ontable long blue block)
    (ontable blue cylinder)
    (ontable big yellow shopping basket)
    (ontable blue basket)
    (clear small red cube_1)
    (clear small red cube_2)
    (clear long yellow block_1)
    (clear long yellow block_2)
    (clear yellow half cylinder)
    (clear long blue block)
    (clear blue cylinder)
    (clear big yellow shopping basket)
    (clear blue basket)
    (handempty)
  )
  (:goal (and ))
)