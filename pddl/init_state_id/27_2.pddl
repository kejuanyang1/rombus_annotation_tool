(define (problem scene1)
  (:domain manip)
  (:objects
    office_01 - item
    office_03 - item
    office_04 - item
    office_08 - item
    office_10 - item
    container_03 - container
  )
  (:init
    (ontable office_01)
    (ontable office_03)
    (ontable office_04)
    (ontable office_08)
    (ontable office_10)
    (ontable container_03)
    (clear office_01)
    (clear office_03)
    (clear office_04)
    (clear office_08)
    (clear office_10)
    (clear container_03)
    (handempty)
  )
  (:goal (and ))
)