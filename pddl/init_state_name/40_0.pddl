(define (problem scene1)
  (:domain manip)
  (:objects
    small red cube_1 - support
    small red cube_2 - support
    long red block - support
    small yellow cube_1 - support
    small yellow cube_2 - support
    yellow cylinder - item
    yellow half cylinder - item
    flat blue block - support
    small green cube_1 - support
    small green cube_2 - support
  )
  (:init
    (ontable small red cube_1)
    (ontable small red cube_2)
    (ontable long red block)
    (ontable small yellow cube_1)
    (ontable small yellow cube_2)
    (ontable yellow cylinder)
    (ontable yellow half cylinder)
    (ontable flat blue block)
    (ontable small green cube_1)
    (ontable small green cube_2)
    (clear small red cube_1)
    (clear small red cube_2)
    (clear long red block)
    (clear small yellow cube_1)
    (clear small yellow cube_2)
    (clear yellow cylinder)
    (clear yellow half cylinder)
    (clear flat blue block)
    (clear small green cube_1)
    (clear small green cube_2)
    (handempty)
  )
  (:goal (and ))
)