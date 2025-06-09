(define (problem scene1)
  (:domain manip)
  (:objects
    office_02 - item
    office_07 - item
    container_05 - container
    container_06 - container
  )
  (:init
    (ontable office_02)
    (ontable office_07)
    (ontable container_05)
    (ontable container_06)
    (clear office_02)
    (clear office_07)
    (clear container_05)
    (clear container_06)
    (handempty)
  )
  (:goal (and ))
)