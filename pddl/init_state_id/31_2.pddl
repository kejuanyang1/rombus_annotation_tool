(define (problem scene1)
  (:domain manip)
  (:objects
    office_02 - item
    office_04 - item
    office_05 - item
    office_10 - item
    container_05 - container
  )
  (:init
    (ontable office_02)
    (ontable office_04)
    (ontable office_10)
    (ontable office_05)
    (ontable container_05)
    (clear office_02)
    (clear office_04)
    (clear office_10)
    (clear office_05)
    (clear container_05)
    (handempty)
  )
  (:goal (and ))
)