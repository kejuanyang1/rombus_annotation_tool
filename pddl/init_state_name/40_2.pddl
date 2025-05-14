(define (problem scene1)
  (:domain manip)
  (:objects
    small red cube_1 small red cube_2 - support
    long red block - support
    small yellow cube_1 small yellow cube_2 - support
    yellow cylinder yellow half cylinder - item
    flat blue block - support
    small green cube_1 small green cube_2 - support
  )
  (:init
    (ontable long red block)
    (ontable small yellow cube_1)
    (ontable yellow cylinder)
    (ontable yellow half cylinder)
    (ontable flat blue block)
    (ontable small green cube_1)
    (ontable small green cube_2)
    (ontable small red cube_1)
    (on small yellow cube_2 small red cube_2)
    (on small red cube_2 small green cube_2)
    (clear small yellow cube_2)
    (clear yellow half cylinder)
    (clear yellow cylinder)
    (clear flat blue block)
    (clear long red block)
    (clear small yellow cube_1)
    (handempty)
  )
  (:goal (and ))
)